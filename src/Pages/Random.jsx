
import React from "react";
import { NavLink,Link,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { createClient } from '@supabase/supabase-js'
import { Bars,Rings } from 'react-loading-icons'

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(URL, KEY);
const Random=()=>{
    const [posts,setPost]=useState([]);
    const[filterData,setFilteredData]=useState([]);
    const[searchItem,setSearchItem]=useState("");
    const [isLoading, setIsLoading] = useState(false); 

    const handleSearch=(event)=>{
        event.preventDefault();
        const{name,value}=event.target;
        setSearchItem(value);
        console.log(searchItem);
    }
    useEffect(()=>{
        setIsLoading(true);
        const getData=async()=>{
         const{data,error}=await supabase
         .from("codeBuddy")
         .select("*")
         .eq("type","random")
         
         if(error){
            console.log(error)
         }else{
            setPost(data);
            
         }
         
        setIsLoading(false);
        

        }
        getData();
        

    },[])
    useEffect(() => {
        const filter = posts.filter(post =>
            post.titile.toLowerCase().includes(searchItem.toLowerCase())
        );
        setFilteredData(filter);
        console.log(filterData); 
    }, [searchItem]);

    const handleClick=()=>{
        window.location="/post";
    }
    const handleSortByLikes = () => {
        const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes); // Sort posts by likes in descending order
        setPost(sortedPosts); // Update the posts state with the sorted posts
    };
   
    return(
        <div className="container">
            
            <div className="left-pannel">
                <button className="new-button" onClick={handleClick} >+ NEW</button>
                <NavLink className="links" to="/">DEBUG</NavLink>
                <NavLink className="links" to="/random">RANDOM</NavLink>
                <NavLink className="links" to="/about">ABOUT</NavLink>
                <button className="popular" onClick={handleSortByLikes}>Most Popular</button>

            </div>
            <div className="right-pannel">
           
                
                <input type="text" className="input-field search" placeholder="serch by title" onChange={handleSearch}/>

                {/* loading animation here */}

                {isLoading && <Bars style={{marginTop:"400px",marginLeft:"200px",color:"green"}}/>}

                {searchItem.length > 0  ? (
                filterData.map((post, i) => (
                    <div className="post-container" key={i} onClick={()=>{
                        window.location=`/${post.titile}`
                    }}>
                    
                    <div className="post-details">
                        <h2 className="post-titile">{post.titile}</h2>
                        <p className="post-details">{post.description}</p>
                        {post.imgUrl != " " && <img src={post.imgUrl} className="post-img"></img>}
                        <p className="timestamp">posted on :{post.created_at.substring(0,10)}</p>
                        {/* <Link to={post.titile}>more ...</Link> */}
                        

                    </div>
                    <div className="comments-container">
                    <div className="upvotes">
                        <button className="upvote"onClick={async()=>{
                            await supabase
                            .from("codeBuddy")
                            .update({ likes: post.likes + 1 })
                            .eq("titile",post.titile)
                            .then(() => {
                                window.location.reload();
                            })
                            
                            

                        }}>upvote :{post.likes}</button>

                    </div>

                    </div>
                </div>
                ))
            ) :(
                posts.map((post,i)=>(
                
                    <div className="post-container" key={i} >
                    
                    <div className="post-details" onClick={()=>{
                        window.location=`/${post.titile}`
                    }}>
                        <h2 className="post-titile">{post.titile}</h2>
                        <p className="post-details">{post.description}</p>
                        {post.imgUrl!=" " &&<img src={post.imgUrl} className="post-img"></img>}
                        <p className="timestamp">posted on :{post.created_at.substring(0,10)}</p>
                        {/* <Link to={post.titile}>more ...</Link> */}
                        

                    </div>
                    <div className="comments-container">
                    <div className="upvotes">
                        <button className="upvote"onClick={async()=>{
                            await supabase
                            .from("codeBuddy")
                            .update({ likes: post.likes + 1 })
                            .eq("titile",post.titile)
                            .then(() => {
                                window.location.reload();
                            })
                            
                            

                        }}>upvote :{post.likes}</button>

                    </div>

                    </div>
                </div>

                ))
            ) 
                
            }

                

            </div>
            
        </div>
    )
    
}
export default Random;