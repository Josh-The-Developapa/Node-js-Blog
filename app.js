const express = require("express");
let app = express();
const mongoose = require("mongoose");
const Blog = require('./models/blog');
var morgan = require('morgan');
const { render } = require("ejs");

const dbURI = 'mongodb+srv://new-user31:3jqLJb4Z@cluster0.kku5a.mongodb.net/Node?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => console.log('connected to db'))
.catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

app.listen(3000);

app.get('/', (req, res) => {
    res.redirect('/blogs');
})

app.get('/', (req, res) => {
    const blogs = [
        {title: "I got into a fight at school", snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: "I did my homework on time", snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: "I insulted my teacher", snippet: 'Lorem ipsum dolor sit amet consectetur'},
    ];

    res.render('index', { title: 'Home', blogs});
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1})
    .then((result) => {
        res.render('index', { title: 'All Blogs', blogs: result})
    })
    .catch((err) => {
        console.log(err);
    })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    
    blog.save()
      .then((result) => {
        res.redirect('/blogs');
    })
      .catch((err) => {
        console.log(err);
    })

})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create new blog'});
});


app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
          res.render('details', {blog: result, title: 'Blog Details'})
      })
      .catch(err => {
            console.log(err);
      });
})

app.get('/add-blogs', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2', 
        snippet: 'Blah blah blah',
        body: 'Lorem ipsum doler consectetur'
    });

    blog.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/all blogs', (req, res) => {
    Blog.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    });
})



app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create new blog'});
});


app.get('/about-us', (req, res) => {
    res.render('/about')
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
});

console.log("Server available at http://127.0.0.1:3000");
