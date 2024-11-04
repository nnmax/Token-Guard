export default function Keynote(props: {
  children: React.ReactNode[]
}) {
  const { children } = props

  return (
    <ul className="mt-10 flex flex-wrap gap-x-[49px] gap-y-4 text-sm/10 font-bold text-[#6E86C2]">
      {
        children.map((child, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className="h-10 flex-[327px] rounded-[5px] border border-dashed border-[#6E86C2] text-center">{child}</li>
        ))
      }
    </ul>
  )
}
