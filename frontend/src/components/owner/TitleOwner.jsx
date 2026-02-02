function TitleOwner({title, subTitle}) {
  return (
    <div>
        <h1 className="text-[30px] font-medium">{title}</h1>
        <p className="text-gray-500 max-w-156 max-md:text-sm mt-1">{subTitle}</p>
    </div>
  )
}

export default TitleOwner