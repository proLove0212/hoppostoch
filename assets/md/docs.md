{{#collections}}

# {{name}}

## {{#folders}}

## Folder: {{name}}

{{#requests}}

### {{name}}

**Method**: {{method}}

**RequestURL**: `{{{url}}}{{{path}}}`

{{#isHeaders}}
**Headers**:

<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
{{#headers}}
<tr>
<td>{{{key}}}</td>
<td>`{{{value}}}`</td>
</tr>
{{/headers}}
</table>
{{/isHeaders}}

{{#isParams}}
**Params**:

<table>
<tr>
<th>type</th>
<th>Key</th>
<th>Value</th>
</tr>
{{#params}}
<tr>
<td>{{type}}</td>
<td>{{{key}}}</td>
<td>{{{value}}}</td>
</tr>
{{/params}}
</table>
{{/isParams}}

{{#isAuth}}
**Authentication Type**: {{{auth}}}  
{{/isAuth}}

{{#bearerToken}}
**BearerToken**: `{{{.}}}`
{{/bearerToken}}

{{#isAuthBasic}}
Username: `{{{httpUser}}}`  
Password: `{{{httpPassword}}}`
{{/isAuthBasic}}

{{#isRawParams}}
**RawParams**:

```json
{{{rawParams}}}
```

{{/isRawParams}}

{{#contentType}}
**ContentType**: `{{{contentType}}}`
{{/contentType}}

{{#preRequestScript}}
**Pre Request Script**:

```js
{
  {
    {
      preRequestScript
    }
  }
}
```

{{/preRequestScript}}

{{#testScript}}
**Test Script**:

```js
{
  {
    {
      testScript
    }
  }
}
```

{{/testScript}}

{{/requests}}

---

{{/folders}}

{{#requests}}

## {{name}}

**Method**: {{method}}

**RequestURL**: `{{{url}}}{{{path}}}`

{{#isHeaders}}
**Headers**:

<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
{{#headers}}
<tr>
<td>{{{key}}}</td>
<td>`{{{value}}}`</td>
</tr>
{{/headers}}
</table>
{{/isHeaders}}

{{#isParams}}
**Params**:

<table>
<tr>
<th>type</th>
<th>Key</th>
<th>Value</th>
</tr>
{{#params}}
<tr>
<td>{{type}}</td>
<td>{{{key}}}</td>
<td>{{{value}}}</td>
</tr>
{{/params}}
</table>
{{/isParams}}

{{#isAuth}}
**Authentication Type**: {{{auth}}}  
{{/isAuth}}

{{#bearerToken}}
**BearerToken**: `{{{.}}}`
{{/bearerToken}}

{{#isAuthBasic}}
Username: `{{{httpUser}}}`  
Password: `{{{httpPassword}}}`
{{/isAuthBasic}}

{{#isRawParams}}
**RawParams**:

```json
{{{rawParams}}}
```

{{/isRawParams}}

{{#contentType}}
**ContentType**: `{{{contentType}}}`
{{/contentType}}

{{#preRequestScript}}
**Pre Request Script**:

```js
{
  {
    {
      preRequestScript
    }
  }
}
```

{{/preRequestScript}}

{{#testScript}}
**Test Script**:

```js
{
  {
    {
      testScript
    }
  }
}
```

{{/testScript}}

{{/requests}}

{{/collections}}

---

Made with [Hoppscotch](https://github.com/hoppscotch/hoppscotch)
