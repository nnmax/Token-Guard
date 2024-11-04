import { Link } from 'react-router-dom'

export default function BackHomeLink() {
  return (
    <Link className="inline-flex items-center px-2 text-xs font-medium text-[#576FAA]" to="/">
      <span className="icon-[mingcute--left-line] text-[32px]"></span>
      <span>Home</span>
    </Link>
  )
}
