import { error } from "console";

export async function loginUser(email:string,password:string) {
    const res= await fetch("http://localhost:3001/auht",{
        method:"POST",
       headers: { "Content-Type": "application/json" },
        body:JSON.stringify({email,password}),
         credentials: "include",
    });
    if(!res.ok) {
        const errorData=await res.json().catch(()=>null);
        const errorMessage=errorData?.message || "Error al iniciar sesion"
        throw new Error(errorMessage)
    }
    return res.json();
}