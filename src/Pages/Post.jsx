import React from "react";
import { useState,useEffect } from "react";
import { createClient } from '@supabase/supabase-js'
const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(URL, KEY);

const Post=()=>{
    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[url,setUrl]=useState("");
    const[type,setType]=useState("");


// function to store value inserted on form
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

   const createPost=async(e)=>{
    e.preventDefault();
    const{data,error}=await supabase
    .from("codeBuddy")
    .insert({titile:title,description:description,imgUrl:url,type:type})
    .select()
    if (error) {
        console.error('Error inserting data:', error);
        return;
    }
    console.log("data inserted",data);
    window.location="/";
   }
    
    return(
        <div>
            <form type="submit" onSubmit={createPost}>
            <label htmlFor="title" className="labels">TITLE:</label><br/>
            <input type="text" id="title" name="title" required onChange={handleChange} placeholder="Enter title .."className="input-field" /><br/><br/>

            <label htmlFor="description" className="labels">DESCRIPTION:</label><br/>
            <textarea rows="10" name="description" id="description" placeholder="Add description here ..."  onChange={handleChange}/><br/><br/>

            <label htmlfor="url">URL:</label><br/>
            <input type="text" name="url" placeholder="insert google drive link" id="url"  onChange={handleChange} className="input-field"/><br/><br/>

            <label >
                <input  type="radio" name="type" value="debug" onChange={handleChange} required />
                DEBUG
            </label>
            <label >
                <input  type="radio" name="type" value="random" onChange={handleChange} required />
                RANDOM
            </label><br/><br/>

            <button type="submit" onClick={createPost} className="add-button">
                ADD

            </button>


            </form>
            



        </div>
    )
}
export default Post;