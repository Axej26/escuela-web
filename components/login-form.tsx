"use client"; 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"   
import toast from "react-hot-toast";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleSumit=async (e:React.FormEvent)=>{
    e.preventDefault();
    try{
      const data = await loginUser(email,password);
      localStorage.setItem("accessToken", data.accessToken);//lo guarda en el localStorage
      toast.success("Usuario autenticado",{id:"login"})
      console.log("Usuario autenticado");
    

      router.push('/dashboard')
    }catch (err:any){
      console.error(err);
      toast.error(err.message || "Error al iniciar sesión", { id: "login" });
    }
    
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login </CardTitle>
          <CardDescription className="flex justify-center">
              <Image
        src="/user.webp" // coloca aquí tu imagen en la carpeta /public
        alt="Login banner"
        width={100}
        height={100}
        className="rounded-md object-cover"
      />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSumit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                
                </div>
                <Input id="password"
                 type="password" 
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                 required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                
              </div>
            </div>
          
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
