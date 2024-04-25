import React from "react";
import { useState,useEffect } from "react";
import { createClient } from '@supabase/supabase-js'
import { useParams } from "react-router-dom";
const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(URL, KEY);


const Description=()=>{
    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[url,setUrl]=useState("");
    const[type,setType]=useState("");
    const handleChange=(event)=>{
        const{name,value}=event.target;
        if(name==="title"){
            setTitle(value);
        }else if(name==="description"){
            setDescription(value);
        }else if(name==="url"){
            setUrl(value);
        }else if(name==="type"){
            setType(value);
        }
    };

    const{holder}=useParams();
    const[filteredData,setFilteredData]=useState(null);
    useEffect(()=>{
        const filterData=async ()=>{
            const{data,error}=await supabase
            .from("codeBuddy")
            .select('*')
            .eq('titile',holder)
            .single()
            if(data){
                setFilteredData(data);
                console.log(filteredData);
                {data && console.log(data)};
                setTitle(data.titile);
                
                setDescription(data.description);
                setUrl(data.imgUrl);
                setType(type);
            }

        }
        filterData();
    },[])
    const deletePost=async()=>{
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        const { error } = await supabase
            .from("codeBuddy")
            .delete()
            .eq("titile", holder);
        if (error) {
            console.error('Error deleting post:', error);
            return;
        }
        alert('Post deleted successfully');
        window.location="/";
        
    }
    const updatePost = async (event) => {
        event.preventDefault();
        if (!window.confirm("This will update the entry.")) return;

        const { error } = await supabase
            .from("codeBuddy")
            .update({
                titile: title, 
                description: description,
                imgUrl: url,
                type:type
            })
            .eq("titile", holder); // Assuming you want to match by the new title
        if (error) {
            console.error('Error updating post:', error);
            return;
        }
        alert('Post updated successfully');
        window.location="/";
    };
    
    return(
        <div>
            <div className="details">
                <h2>post details :</h2>
                <p>Post title:{filteredData && filteredData.titile}</p>
                <p>Total upvotes:{filteredData && filteredData.likes}</p>
                <p>Post type :{filteredData && filteredData.type}</p>
                <p>Post created at :{filteredData && filteredData.created_at}</p>
            </div>
            
            
            <form type="submit" onSubmit={updatePost}>
            <label htmlFor="title" className="labels">TITLE:</label><br/>
            <input type="text" id="title" name="title" required onChange={handleChange} placeholder={title}className="input-field" /><br/><br/>

            <label htmlFor="description" className="labels">DESCRIPTION:</label><br/>
            <textarea rows="10" name="description" id="description" placeholder={description}  onChange={handleChange} /><br/><br/>

            <label htmlfor="url">URL:</label><br/>
            <input type="text" name="url" placeholder={url} id="url"  onChange={handleChange} className="input-field"/><br/><br/>

            <label >
                <input  type="radio" name="type" value="debug" onChange={handleChange} required />
                DEBUG
            </label>
            <label >
                <input  type="radio" name="type" value="random" onChange={handleChange} required />
                RANDOM
            </label><br/><br/>

            


            </form>
            <p style={{color:"red",fontSize:"16px"}}>Make necessary changes and click update to update this entry ,pressing delete will permanently delete this entry</p>
            <div className="footer">
                
                <button onClick={updatePost} className="update-btn">UPDATE</button>
                <button type="button" onClick={deletePost}  className="delete-btn">DELETE</button>

            </div>


        </div>
    )

}
export default Description;
