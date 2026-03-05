import Link from "next/link";
import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <nav className="mb-6 text-sm text-[#6E6E73]">
        <Link href="/admin/products" className="hover:text-[#1D1D1F]">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1D1D1F]">Add product</span>
      </nav>
      <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-8">
        Add product
      </h1>
      <ProductForm />
    </div>
  );
}
