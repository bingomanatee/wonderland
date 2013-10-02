# Messages

This component allows you to get or set messages to the next request via context.add_message(text, key).

In the template, you can call messages(key?) to retrieve a set of messages:

``` json

[
  {"key": "string", "text": "string"}
  ...
]

```

