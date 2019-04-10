const File = require('../models/File');
const Box = require('../models/Box');

class FileController {
    async store(req, res) {
        const box = await Box.findById(req.params.id);
        const file = await File.create({
            title: req.file.originalname,
            path: req.file.key
        });

        box.files.push(file);
        await box.save();

        //faz o realtime para todos os usuarios que estao conectados a essa box.
        req.io.sockets.im(box._id).emit('file', file);

        return res.json(file);
    }
}

module.exports = new FileController();