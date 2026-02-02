function Title({title,subTitle,align}) {
  return (
    <div className={`flex flex-col justify-center items-center text-center gap-2 ${align=="left" && `md:items-start md:text-left`}`}>
        <h1 className="text-[40px] max-sm:text-4xl font-semibold">{title}</h1>
        <p className="text-gray-500 max-sm:text-sm">{subTitle}</p>
    </div>
  )
}

export default Title