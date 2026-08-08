function Footer() {
  return (
    <div className="fixed bottom-3 right-4 z-50 flex items-center gap-2 bg-navy/90 backdrop-blur-sm text-cream/80 text-xs px-3 py-1.5 rounded-full shadow-lg">
      <span>
        Developed by <span className="text-amber font-medium">Shashank</span>
      </span>
      <span className="text-cream/30">|</span>
      <a
        href="https://www.instagram.com/shashankteaches?igsh=bW5oOG1mYmR3azBl"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-amber transition-colors"
      >
        Instagram
      </a>
    </div>
  )
}

export default Footer