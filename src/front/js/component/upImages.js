import React from "react";
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';



export const UploadFoto = ()=>{



    const handleSelectImage=(e)=>{
        console.log(e.target.files?.[0]);
        
    }


    return (
        <div className="">
            <input type="File" onChange={handleSelectImage}/>
        </div>







);}