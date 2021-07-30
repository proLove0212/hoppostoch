/* An `action` is a unique verb that is associated with certain thing that can be done on Hoppscotch.
 * For example, sending a request.
 */

import { onBeforeUnmount, onMounted } from "@nuxtjs/composition-api"

export type HoppAction =
  | "request.send-cancel" // Send/Cancel a Hoppscotch Request
  | "request.reset" // Clear request data
  | "request.copy-link" // Copy Request Link
  | "request.save" // Save to Collections
  | "request.method.next" // Select Next Method
  | "request.method.prev" // Select Previous Method
  | "request.method.get" // Select GET Method
  | "request.method.head" // Select HEAD Method
  | "request.method.post" // Select POST Method
  | "request.method.put" // Select PUT Method
  | "request.method.delete" // Select DELETE Method

type BoundActionList = {
  // eslint-disable-next-line no-unused-vars
  [_ in HoppAction]?: Array<() => void>
}

const boundActions: BoundActionList = {}

export function bindAction(action: HoppAction, handler: () => void) {
  if (boundActions[action]) {
    boundActions[action]?.push(handler)
  } else {
    boundActions[action] = [handler]
  }
}

export function invokeAction(action: HoppAction) {
  boundActions[action]?.forEach((handler) => handler())
}

export function unbindAction(action: HoppAction, handler: () => void) {
  boundActions[action] = boundActions[action]?.filter((x) => x !== handler)
}

export function defineActionHandler(action: HoppAction, handler: () => void) {
  onMounted(() => {
    bindAction(action, handler)
    console.log(`Action bound: ${action}`)
  })

  onBeforeUnmount(() => {
    unbindAction(action, handler)
    console.log(`Action unbound: ${action}`)
  })
}
