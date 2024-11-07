'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react"
import Navbar from '@/components/Hero/Navbar'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { v4 as uuidV4 } from 'uuid'
import PopupMessage from "@/components/global/Popup"
import { IPopupMessage } from "@/lib/types"
import { fetchJobsData } from "@/lib/supabase/queries/jobs"
import { getCookie } from "@/lib/server-actions/auth-actions"

export default function JobPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<any>(null)
  const chatId = uuidV4()
  const [popup, setPopup] = useState<IPopupMessage>({
    message: "",
    mode: null,
    show: false,
  });

  const hidePopup = () => {
    setPopup({ show: false, message: "", mode: "" });
  };

  const getJobs = async () => {
    const { data, error }: any = await fetchJobsData()
    if (error) {
      console.log(error)
      setPopup({ message: error.message, show: true, mode: 'error' })
    }
    console.log(data)
    setJobs(data)
  }

  useEffect(() => {
    getJobs()
    
  }, [])
  

  const handleContactUser = (userId: string, jobId: string) => {
    localStorage.setItem('currentSellerId', userId);
    console.log(localStorage.getItem('currentSellerId'))
  
    router.push(`/buy/jobPostings/${jobId}/${chatId}/chat`)
  };
  return (
    <>
      <Navbar/>
      {popup.show && (
        <PopupMessage
          message={popup.message}
          mode={popup.mode}
          onClose={hidePopup}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "red",
            color: "white",
            padding: "10px",
          }}
        />
      )}
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Job Listings</h1>
      {jobs === null ? "Loading" : (
        jobs.length === 0 ? "Whoops, no jobs created yet." : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: any) => (
              <Card key={job.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      {/* supposed to show user image but i have not done the kyc logic */}
                      <AvatarImage src={job.image} alt={job.company} />
                      <AvatarFallback>I</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {/* <p className="text-sm text-muted-foreground">{job.company}</p> */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{job.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <Badge variant="secondary">{job.job_type.toUpperCase()}</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => handleContactUser(job.user_id, job.id)}>Contact</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
    </>
  )
}