import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Reviews() {
  return (
      <div className="bg-background rounded-lg border p-6 mt-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground">
              I've been using these headphones for a few weeks now and I'm really impressed with the sound quality and
              comfort. The noise cancellation is also top-notch.
            </p>
          </Card>
          <Card className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Jane Smith</h3>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
              </div>
            </div>
            <p className="text-muted-foreground">
              These headphones are a game-changer! The sound quality is incredible, and the battery life is amazing. I
              highly recommend them.
            </p>
          </Card>
          <Card className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Michael Johnson</h3>
                  <p className="text-sm text-muted-foreground">3 weeks ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground">
              The headphones are good, but the noise cancellation could be better. Overall, they're a decent pair of
              headphones for the price.
            </p>
          </Card>
        </div>
      </div>
    
  )
}

function BookmarkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}


function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}