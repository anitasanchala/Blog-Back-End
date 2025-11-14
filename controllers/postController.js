const { default: db } = require("../models/db");


const getPosts = async (req, res) => {
    try {
        const { page } = req.body;
        const pageSize = page || 10;
        const limit = 10;
        const offset = (pageSize - 1) * limit;

        const getPostsCount = `SELECT count(*) as count FROM posts`;
        const [getPostsCountData] = await db.promise().query(getPostsCount);

        const getPosts = `SELECT id, title, content FROM posts limit ? offset ?`;
        const [getPostsData] = await db.promise().query(getPosts,[limit, offset]);

        if (getPostsData.length === 0) {
            return res.status(200).json({ status:200,mes: "Post Not Found" });
        }
        console.log('pageSize,offset',limit,offset)
        
        return res.status(200).json({ status:200,mes: "Post fetch Successfully", data: {totalPosts: getPostsCountData[0]?.count, data:getPostsData} });
    } catch (error) {
        console.log(error,"error");
        return res.status(600).json({ mes: error.message });
    }
}

const createPosts = async (req, res) => {
    try {
        const { title, content } = req.body;

        const insertPost = `INSERT INTO posts(title, content) VALUES (?,?)`;
        const [insertPostdata] = await db.promise().query(insertPost, [title, content]);
        
        if (insertPostdata.affectedRows === 0) {
            return res.status(200).json({ status:403,mes: "Post Not Inserted" });
        }

        return res.status(200).json({ status:200,mes: "Post Created Successfully" });
    } catch (error) {
        // throw new Error("Error while create post");
        return res.status(600).json({ mes: error.message });
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.body;
        console.log('req.body',req.body);
        
        const deletePost = `DELETE FROM posts WHERE id = ?`;
        const [deletePostdata] = await db.promise().query(deletePost, [postId]);
        
        if (deletePostdata.affectedRows === 0) {
            return res.status(200).json({ status:403,mes: "Post Not Deleted" });
        }

        return res.status(200).json({ status:200,mes: "Post Deleted Successfully" });
    } catch (error) {
        return res.status(600).json({ mes: error.message });
    }
}

const editPost = async (req, res) => {
    try {
        const { id,title,content } = req.body;
        console.log('req.body',req.body);
        
        const editPost = `UPDATE posts SET title = ?,content = ? WHERE id = ?`;
        const [editPostdata] = await db.promise().query(editPost, [title,content,id]);
        
        if (editPostdata.affectedRows === 0) {
            return res.status(200).json({ status:403,mes: "Post Not Found" });
        }

        const getPost = `select id,title,content from posts where id = ?`;
        const [getPostData] = await db.promise().query(getPost, [id]);

        return res.status(200).json({ status:200,mes: "Post Edited Successfully",data: getPostData[0] });
    } catch (error) {
        return res.status(600).json({ mes: error.message });
    }
}

const getPostsById = async (req, res) => {
    try {
        const { id } = req.body;
        console.log("req.body",req.body);
        
        const getPosts = `SELECT id, title, content FROM posts WHERE id = ?`;
        const [getPostsData] = await db.promise().query(getPosts,[id]);
        console.log("getPostsData",getPostsData);
        
        if (getPostsData.length === 0) {
            return res.status(200).json({ status:200,mes: "Post Not Found" });
        }
        
        return res.status(200).json({ status:200,mes: "Post fetch Successfully", data: getPostsData[0] });
    } catch (error) {
        console.log(error,"error");
        return res.status(600).json({ mes: error.message });
    }
}

module.exports = { getPosts, createPosts,deletePost,editPost,getPostsById }