/** Routes for users of pg-relationships-demo. */

const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");

router.get('/:id', async (req, res, next) => {
    try {
        const results = await db.query(`
            SELECT messages.id, messages.msg, tags.tag 
            FROM messages 
            AS m 
            LEFT JOIN messages_tags 
            AS mt 
            ON m.id = mt.message_id
            LEFT JOIN tags as tag
            ON mt.tag.tag_code = t.code`)

        if (results.rows.length === 0) {
            throw new ExpressError('msg not found', 404)
        }

        const { id, msg} = results.rows[0];
        const tags = results.rows.map(r => r.tag);
        return res.send({
            id, msg, tags
        })
    } catch (e) {
        return next(e)
    }
})

router.patch('/:id', async (req, res, next) => {
    try {   
        const results = await db.query(`UPDATE messages SET msg=$1 WHERE id=$2`, [req.body.msg, req.params.id])
        if (results.rows.length === 0) {
            throw new ExpressError('msg not found', 404)
        }
        return res.json(results.rows[0])
    } catch (e) {
        return next(e)
    }
})



module.exports = router;