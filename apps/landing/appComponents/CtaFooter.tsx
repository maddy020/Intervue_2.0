import { Button } from "@/components/ui/button"

const CtaFooter = () => {
  return (
    <div className="CtaFooter">
       <h1 className="CtaTitle">Sign up to get started.</h1>
       <p className="text-lg tracking-tighter text-black/70 text-center mt-5">Ready to Secure Your Interview Seat? Sign Up Now to Get Started with Our Hiring Platform</p>
       <div className="container items-center gap-4">
          <h1 className="">Get for free</h1>
          <Button>Learn more
          <span className="material-symbols-outlined">
            arrow_right_alt
          </span>
          </Button>
       </div>
    </div>
  )
}

export default CtaFooter
