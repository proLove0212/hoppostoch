import CodeMirror from "codemirror"

import "codemirror-theme-github/theme/github.css"
import "codemirror/theme/base16-dark.css"
import "codemirror/theme/tomorrow-night-bright.css"

import "codemirror/lib/codemirror.css"
import "codemirror/addon/lint/lint.css"
import "codemirror/addon/dialog/dialog.css"
import "codemirror/addon/hint/show-hint.css"

import "codemirror/addon/fold/foldgutter.css"
import "codemirror/addon/fold/foldgutter"
import "codemirror/addon/fold/brace-fold"
import "codemirror/addon/fold/comment-fold"
import "codemirror/addon/fold/indent-fold"
import "codemirror/addon/display/autorefresh"
import "codemirror/addon/lint/lint"
import "codemirror/addon/hint/show-hint"
import "codemirror/addon/display/placeholder"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/search/search"
import "codemirror/addon/search/searchcursor"
import "codemirror/addon/search/jump-to-line"
import "codemirror/addon/dialog/dialog"
import "codemirror/addon/selection/active-line"

import { watch, onMounted, ref, Ref, useContext } from "@nuxtjs/composition-api"
import { LinterDefinition } from "./linting/linter"
import { Completer } from "./completion"

type CodeMirrorOptions = {
  extendedEditorConfig: Omit<CodeMirror.EditorConfiguration, "value">
  linter: LinterDefinition | null
  completer: Completer | null
}

const DEFAULT_EDITOR_CONFIG: CodeMirror.EditorConfiguration = {
  autoRefresh: true,
  lineNumbers: true,
  foldGutter: true,
  autoCloseBrackets: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  extraKeys: {
    "Ctrl-Space": "autocomplete",
  },
  viewportMargin: Infinity,
  styleActiveLine: true,
}

/**
 * A Vue composable to mount and use Codemirror
 *
 * NOTE: Make sure to import all the necessary Codemirror modules,
 * as this function doesn't import any other than the core
 * @param el Reference to the dom node to attach to
 * @param value Reference to value to read/write to
 * @param options CodeMirror options to pass
 */
export function useCodemirror(
  el: Ref<any | null>,
  value: Ref<string>,
  options: CodeMirrorOptions
): { cm: Ref<CodeMirror.Position | null>; cursor: Ref<CodeMirror.Position> } {
  const { $colorMode } = useContext() as any

  const cm = ref<CodeMirror.Editor | null>(null)
  const cursor = ref<CodeMirror.Position>({ line: 0, ch: 0 })

  const updateEditorConfig = () => {
    Object.keys(options.extendedEditorConfig).forEach((key) => {
      // Only update options which need updating
      if (
        cm.value &&
        cm.value?.getOption(key as any) !==
          (options.extendedEditorConfig as any)[key]
      ) {
        cm.value?.setOption(
          key as any,
          (options.extendedEditorConfig as any)[key]
        )
      }
    })
  }

  const updateLinterConfig = () => {
    if (options.linter) {
      cm.value?.setOption("lint", options.linter)
    }
  }

  const updateCompleterConfig = () => {
    if (options.completer) {
      cm.value?.setOption("hintOptions", {
        completeSingle: false,
        hint: async (editor: CodeMirror.Editor) => {
          const pos = editor.getCursor()
          const text = editor.getValue()

          const token = editor.getTokenAt(pos)
          // It's not a word token, so, just increment to skip to next
          if (token.string.toUpperCase() === token.string.toLowerCase())
            token.start += 1

          const result = await options.completer!(text, pos)

          if (!result) return null

          return <CodeMirror.Hints>{
            from: { line: pos.line, ch: token.start },
            to: { line: pos.line, ch: token.end },
            list: result.completions
              .sort((a, b) => a.score - b.score)
              .map((x) => x.text),
          }
        },
      })
    }
  }

  const initialize = () => {
    if (!el.value) return

    cm.value = CodeMirror(el.value!, DEFAULT_EDITOR_CONFIG)

    cm.value.setValue(value.value)

    setTheme()
    updateEditorConfig()
    updateLinterConfig()
    updateCompleterConfig()

    cm.value.on("change", (instance) => {
      // External update propagation (via watchers) should be ignored
      if (instance.getValue() !== value.value) {
        value.value = instance.getValue()
      }
    })

    cm.value.on("cursorActivity", (instance) => {
      cursor.value = instance.getCursor()
    })
  }

  // Boot-up CodeMirror, set the value and listeners
  onMounted(() => {
    initialize()
  })

  // Reinitialize if the target ref updates
  watch(el, () => {
    if (cm.value) {
      const parent = cm.value.getWrapperElement()
      parent.remove()
      cm.value = null
    }
    initialize()
  })

  const setTheme = () => {
    if (cm.value) {
      cm.value?.setOption("theme", getThemeName($colorMode.value))
    }
  }

  const getThemeName = (mode: string) => {
    switch (mode) {
      case "system":
        return "default"
      case "light":
        return "github"
      case "dark":
        return "base16-dark"
      case "black":
        return "tomorrow-night-bright"
      default:
        return "default"
    }
  }

  // If the editor properties are reactive, watch for updates
  watch(() => options.extendedEditorConfig, updateEditorConfig, {
    immediate: true,
    deep: true,
  })
  watch(() => options.linter, updateLinterConfig, { immediate: true })
  watch(() => options.completer, updateCompleterConfig, { immediate: true })

  // Watch value updates
  watch(value, (newVal) => {
    // Check if we are mounted
    if (cm.value) {
      // Don't do anything on internal updates
      if (cm.value.getValue() !== newVal) {
        cm.value.setValue(newVal)
      }
    }
  })

  // Push cursor updates
  watch(cursor, (value) => {
    if (value !== cm.value?.getCursor()) {
      cm.value?.focus()
      console.log(value)
      cm.value?.setCursor(value)
    }
  })

  // Watch color mode updates and update theme
  watch(() => $colorMode.value, setTheme)

  return {
    cm,
    cursor,
  }
}
