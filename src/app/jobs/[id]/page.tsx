import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react"
import Navbar from '@/components/Hero/Navbar'

// Mock data for job listings
const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    description: "We're looking for an experienced React developer to join our team and help build cutting-edge web applications.",
    salary: "$120,000 - $150,000",
    jobType: "Full-time",
    location: "San Francisco, CA",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignHub",
    description: "Join our creative team to design intuitive and beautiful user experiences for various digital products.",
    salary: "$90,000 - $120,000",
    jobType: "Part-time",
    location: "Remote",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudSystems",
    description: "Help us build and maintain robust cloud infrastructure and streamline our deployment processes.",
    salary: "$130,000 - $160,000",
    jobType: "Full-time",
    location: "New York, NY",
    image: "https://i.pravatar.cc/150?img=3",
  },
]

export default function JobPage() {
  return (
    <>
      <Navbar/>
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Job Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={job.image} alt={job.company} />
                  <AvatarFallback>{job.company[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
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
                  <Badge variant="secondary">{job.jobType}</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Contact</Button>
              <Button>Hire Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </>
  )
}