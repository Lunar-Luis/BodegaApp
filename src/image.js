// Comprime/redimensiona una imagen antes de subirla (ahorra espacio y datos).
// Devuelve un Blob JPEG (~50-150 KB típico).
export async function comprimirImagen(file, maxLado = 800, calidad = 0.72) {
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })
  const img = await new Promise((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = dataUrl
  })

  let { width, height } = img
  if (width >= height && width > maxLado) {
    height = Math.round((height * maxLado) / width)
    width = maxLado
  } else if (height > width && height > maxLado) {
    width = Math.round((width * maxLado) / height)
    height = maxLado
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(img, 0, 0, width, height)

  return new Promise((res) => canvas.toBlob((b) => res(b), 'image/jpeg', calidad))
}
