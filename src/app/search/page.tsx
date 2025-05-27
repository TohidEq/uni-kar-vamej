import SearchInput from "@/components/SearchInput";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex  justify-center text-center" dir="rtl">
      <div className="pt-30">
        <h1 className="text-xl opactiy-70 pb-6">هیچ عبارتی وارد نشده!</h1>
        <SearchInput />
      </div>
    </div>
  );
}
