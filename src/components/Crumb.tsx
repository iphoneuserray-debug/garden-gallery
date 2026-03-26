import { useLocation, Link } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// 路径展示
export function Crumb() {
    const { pathname } = useLocation();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <Breadcrumb className="mt-3 mb-3">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {/* 路径添加链接 */}
                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/");
                    const isLast = index === segments.length - 1;
                    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                    return (
                        <>
                            <BreadcrumbSeparator key={`sep-${index}`} />
                            <BreadcrumbItem key={href}>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={href}>{label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
