import express, { Request, Response } from 'express'
import cors from 'cors'
import { VideoDatabase } from './database/VideoDatabase'
import { Video } from './models/Video'
import { TVideoDB } from './types'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


 // exercicio 2
// getVideos usando classes
app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string

        const videoDatabase = new VideoDatabase()
        const videosDB = await videoDatabase.findVideos(q)

        const videos: Video[] = videosDB.map((videoDB) =>
            new Video(
                videoDB.id,
                videoDB.title,
                videoDB.duration,
                videoDB.created_at
            )
        )

        res.status(200).send(videos)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// addVideo usando classes
app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'name' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'email' deve ser number")
        }

        // const [ videoDBExists ]: TVideoDB[] | undefined[] = await db("videos").where({ id })

        const videoDatabase = new VideoDatabase ()
        const videoDBExists = await videoDatabase.findVideoById(id)

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            created_at: newVideo.getCreatedAt()
        }

        // await db("videos").insert(newVideoDB)
        // const [ VideoDB ]: TVideoDB[] = await db("videos").where({ id })
        await videoDatabase.insertVideo(newVideoDB)

        res.status(201).send(newVideoDB)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

    //exercicio 3
//editVideo usando classes
app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newTitle = req.body.title
        const newDuration = req.body.duration

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }
        }
     
        if (newTitle !== undefined) {
            if (typeof newTitle !== "string") {
                res.status(400)
                throw new Error("'title' deve ser string")
            }    
        }
        
        if (newDuration !== undefined) {
            if (typeof newDuration !== "number") {
                res.status(400)
                throw new Error("'duration' deve ser number")
            }
        }

        const videoDatabase = new VideoDatabase ()
        const videoDB = await videoDatabase.findVideoById(idToEdit)

        // const [ videoDB ]: TVideoDB[] | undefined[] = await db("videos").where({ id: idToEdit })

        if (!videoDB) {
            res.status(400)
            throw new Error("'id' não encontrada")
        }
    
        const updatedVideo = new Video(
            newId,
            newTitle,
            newDuration,
            videoDB.created_at
        )

        const updatedVideoDB: TVideoDB = {
            id: updatedVideo.getId() || videoDB.id,
            title: updatedVideo.getTitle() || videoDB.title,
            duration: isNaN(updatedVideo.getDuration())? videoDB.duration : updatedVideo.getDuration(),
            created_at: updatedVideo.getCreatedAt()
        }

        // await db("videos").update(updatedVideoDB).where({ id: idToEdit })
        await videoDatabase.updateVideo(idToEdit, updatedVideoDB);
        res.status(201).send(updatedVideo)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//deleteVideo usando classes
app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        // const [video]: TVideoDB[] | undefined[] = await db("videos").where({id: idToDelete})
        const videoDatabase = new VideoDatabase ()
        const video = await videoDatabase.findVideoById(idToDelete)
        
        if (!video) {
            res.status(400)
            throw new Error("'id' do produto não encontrada")
        }

        // await db("videos").del().where({id: idToDelete})
        await videoDatabase.deleteVideo(idToDelete)

        res.status(200).send({message: "Produto deletado com sucesso"})

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
