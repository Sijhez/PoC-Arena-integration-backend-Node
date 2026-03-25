//imports
const express = require("express")
const app = express()
//configuracion avanzada para testeo en browser
const cors = require("cors")

const fetchingArena = async () => {
    try {
        const response = await fetch("https://cached-api.arena.im/v1/liveblog/tvazteca/eYsOvI6")
        const data = await response.json()
        return data;
    } catch (error) {
        console.error("Error al obtener datos de la API:", error)
    }
}

/* <script async="" src="https://go.arena.im/public/js/arenalib.js?p=tvazteca&amp;e=eYsOvI6"></script> */

const renderingHtml = (arenaData) => {
  const eventInfo = arenaData.eventInfo || {}
  const title = eventInfo.name || 'Liveblog'
  const description = eventInfo.description || ''

  const allPosts = arenaData.posts || []

  const postsHtml = allPosts.map(post => {
    const postText = post.message
    const postTitle = postText.title || ''
    const postDescription = postText.text || ''
    const publishedAt = new Date(post.createdAt) || ''

    return `
      <article class="arena-post">
        <h2 class="arena-post__title">${postTitle}</h2>
        <time class="arena-post__time">${publishedAt}</time>
        <div class="arena-post__content">${postDescription}</div>
      </article>
      <hr>
    `
  }).join('\n')

  return `
    <section class="arena-liveblog-ssr">
      <header class="arena-liveblog-ssr__header">
        <h1>${title}</h1>
        <p>${description}</p>
      </header>

      <div class="arena-liveblog-ssr__posts">
        ${postsHtml || '<p>No hay entradas disponibles.</p>'}
      </div>
    </section>
  `
}

app.use(express.json())
app.use(cors())
app.listen(3002, () => {
    console.log("Servidor escuchando en el puerto 3002")
})

//configuracion avanzada para testeo en browser

app.get('/home', async (req, res) =>{
  const arenaData = await fetchingArena();
  const renderLiveBlog = renderingHtml(arenaData);
    
    res.type('html').send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Liveblog TV Azteca</title>
        </head>
        <body>
        <div class="arena-liveblog" data-publisher="tvazteca" data-event="eYsOvI6" data-version="1">
          ${renderLiveBlog}
          </div>
          <script async="" src="https://go.arena.im/public/js/arenalib.js?p=tvazteca&amp;e=eYsOvI6"></script>
        </body>
      </html>
    `);
})