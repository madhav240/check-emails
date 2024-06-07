import EmailClassSpan from "./EmailClassSpan";

export default function EmailCard({ data }) {
  return (
    <div className="px-2 py-3 my-1 bg-white rounded-sm">
      <div className="flex flex-row">
        <h1 className="line-clamp-1 font-semibold w-full">{data.subject}</h1>
        <div className="pl-2 -mt-1">
          <EmailClassSpan classification={data.classification} />
        </div>
      </div>
      <p className="line-clamp-2 text-sm h-10">{data.snippet}</p>
    </div>
  );
}
