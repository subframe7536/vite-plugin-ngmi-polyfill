import { parseReadableStream } from 'music-metadata-browser'

const input = document.getElementById('input') as HTMLInputElement
input?.addEventListener('change', async () => {
  const file = input.files?.[0]
  if (!file) { return }

  console.log(
    await parseReadableStream(file.stream()),
  )
})