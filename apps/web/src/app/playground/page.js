import AddCategoryDialog from "@/components/dialog/categorydialog";

export default function Playground() {
   return (
      <div>
         <AddCategoryDialog isOpen={true} title={"Add Category"} />
      </div>
   );
}
