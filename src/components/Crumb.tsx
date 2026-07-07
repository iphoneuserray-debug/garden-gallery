import { Fragment } from "react";
import { useLocation, Link } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import styles from './Crumb.module.css'

interface CrumbItem { label: string; href?: string }
interface CrumbProps { items?: CrumbItem[] }

export function Crumb({ items }: CrumbProps = {}) {
    const { pathname } = useLocation();

    const resolved: CrumbItem[] = items ?? pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, arr) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            href: index < arr.length - 1 ? "/" + arr.slice(0, index + 1).join("/") : undefined,
        }));

    return (
        <Breadcrumb className={styles.crumb}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {resolved.map((item, index) => (
                    <Fragment key={index}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link to={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
