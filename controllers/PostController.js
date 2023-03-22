import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId // при создании id же будет в req
        });

        const post = await doc.save();

        res.json(post)
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "failed to create post!"});
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.status(200).send(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "failed to get posts!"});
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: {viewsCount: 1} // инкр просмотров
            },
            {
                returnDocument: 'after' // вернуть новый документ после обновления
            })
            .then((doc) => { // функция, которая будет выполняться
                if (!doc) {
                    return res.status(404).json({message: "post will not be found"});
                }
                res.json(doc);
            });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "failed to get post!"});
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId
            })
            .then((doc) => {
                if (!doc) {
                    return res.status(404).json({message: "post will not be removed"});
                }
                res.json({success: true});
            });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "failed to get post!"});
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId
            })
            .then(res.json({success: true}));
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "failed to update post!"});
    }
}