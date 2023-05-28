import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import {useState} from 'react'
const categoriesList = [
    { id: 1, name: 'Health' },
    { id: 2, name: 'Grocery' },
    { id: 3, name: 'Tools' },
    { id: 4, name: 'Music' },
    { id: 5, name: 'Electronics' },
    { id: 6, name: 'Kids' },
    { id: 7, name: 'Clothing' },
    { id: 8, name: 'Shoes' },
    { id: 9, name: 'Sports' },
    { id: 10, name: 'Technologie' },

  ];
const modules={
    toolbar:[
        [{'header': [1,2,false]}],
        ['bold','italic','underline','strike','blockquote'],
        [{'list':'ordered'},{'list':'bullet'}],
        ['link','image']
        ['clean']
    ]
}
const formats =[
    'header',
    'bold','italic','underline','strike','blockquote',
    'list','bullet','ident',
    'link','image'
]

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);

    const handleCategorySelection = (isChecked, categoryId) => {
    if (isChecked) {
        setCategories([...categories, categoryId]);
    } else {
        setCategories(categories.filter((id) => id !== categoryId));
    }
    };
 
     function createNewArticle(ev){
        ev.preventDefault();
        const data=new FormData();
        data.append('titre', title);
        data.append('contenu', content);
        categories.forEach((categoryId) => {
            data.append('categories[]', categoryId);
          });
        data.set('file', file);
        fetch( 'http://localhost:3001/articles'
        , {
            method: 'POST',
            headers: {
              Authorization: localStorage.getItem('token'),
            },
            body: data,
          })
            .then((response) => {
              if (response.ok) {
                console.log(response);
                alert('Article created successfully!');
                // Handle any further actions after successful article creation
              } else {
                throw new Error('Failed to create article');
              }
            })
            .catch((error) => {
              alert('Error creating article:', error);
              // Handle error case
            });
        
        
    }
          return(
            <form onSubmit={createNewArticle}>
                <input type="text" 
                placeholder={'Title'}
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                />
                <input type="file" onChange={ev=>setFile(ev.target.files[0])} />
                <ReactQuill value={content}
                  onChange={(newContent) => setContent(newContent)}
                 modules={modules}
                 formats={formats}/>
                <div style={{ display: 'flex' , flexWrap:'wrap' ,justifyContent:'center'}}>
                    {categoriesList.map((category) => (
                    <div key={category.id} style={{padding: '40px', marginLeft: '20px'}}>
                        <input
                        type="checkbox"
                        id={category.id}
                        checked={categories.includes(category.id)}
                        onChange={(e) => handleCategorySelection(e.target.checked, category.id)}
                        />
                        <label htmlFor={category.id}>{category.name}</label>
                    </div>
                    ))}
                </div>
                <button style={{marginTop:'5px'}}>Create Post</button>
            </form>
        
        );
    }

    
    