from openai import OpenAI

client = OpenAI(
  api_key="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"
)

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  store=True,
  messages=[
    {"role": "user", "content": "write a haiku about ai"}
  ]
)

print(completion.choices[0].message);
