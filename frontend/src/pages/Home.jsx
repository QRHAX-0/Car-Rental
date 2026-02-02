import Banner from "../components/Banner"
import FeatureSection from "../components/FeatureSection"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import NewSletter from "../components/NewSletter"
import Testimonials from "../components/Testimonials"
function Home() {
  return (
    <>
        <Hero />
        <FeatureSection/>
        <Banner />
        <Testimonials />
        <NewSletter />
    </>
  )
}

export default Home