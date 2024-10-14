import { Button } from '@/components/ui/button'
import FormGenerator from '@/components/FormGenerator'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex flex-col items-center  p-24 md:container ">  
    
      <FormGenerator />
    </main>
  )
}
