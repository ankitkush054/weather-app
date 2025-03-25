
import { cn } from "@/utils/cn";
import React from "react";
import { FaSearch } from "react-icons/fa";



type Props = {
    className?:string;
    value:string;
    onChange:React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit:React.FormEventHandler<HTMLFormElement> | undefined;
  };

export default function SearchBox(prop:Props){
    return(
<form action="" onSubmit={prop.onSubmit} className={cn("flex relative items-center justify-center h-10",prop.className)}>
    <input type="text" value={prop.value}
    onChange={prop.onChange}
     placeholder="Search Location..."  className="border px-4 py-2 w-[230px] rounded-1-md focus:outline-none focus:border-blue-300 h-full"/>
   <button className="bg-blue-500 px-4 py-[9px] text-white rounded-r-md focus:outline-none hover:bg-blue-600  h-full"><FaSearch /></button> 
</form>
    )
}

