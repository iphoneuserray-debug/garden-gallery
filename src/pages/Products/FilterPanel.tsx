import { Slider } from '@/components/ui/slider'
import styles from './FilterPanel.module.css'

export interface Filters {
    priceRange: [number, number]
    inStock: 'all' | 'in' | 'out'
    tags: string[]
}

interface FilterPanelProps {
    maxPrice: number
    allTags: string[]
    filters: Filters
    onChange: (f: Filters) => void
}

export default function FilterPanel({ maxPrice, allTags, filters, onChange }: FilterPanelProps) {
    const setPrice = (v: number[]) => onChange({ ...filters, priceRange: [v[0], v[1]] as [number, number] })
    const setInStock = (v: Filters['inStock']) => onChange({ ...filters, inStock: v })
    const toggleTag = (tag: string) => {
        const next = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag]
        onChange({ ...filters, tags: next })
    }

    const isDefault = filters.inStock === 'all' && filters.tags.length === 0
        && filters.priceRange[0] === 0 && filters.priceRange[1] >= maxPrice

    return (
        <div className={styles.panel}>
            {/* Price */}
            <div>
                <p className={styles.sectionLabel}>Price</p>
                <Slider
                    value={filters.priceRange}
                    onValueChange={setPrice}
                    min={0}
                    max={maxPrice || 800}
                    step={5}
                    className={styles.slider}
                />
                <div className={styles.priceRow}>
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                </div>
            </div>

            {/* Availability */}
            <div>
                <p className={styles.sectionLabel}>Availability</p>
                <div className={styles.list}>
                    {(['all', 'in', 'out'] as const).map(v => (
                        <button
                            key={v}
                            onClick={() => setInStock(v)}
                            className={`${styles.optionButton} ${filters.inStock === v ? styles.optionActive : ''}`}
                        >
                            {v === 'all' ? 'All' : v === 'in' ? 'In Stock' : 'Out of Stock'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
                <div>
                    <p className={styles.sectionLabel}>Tags</p>
                    <div className={styles.list}>
                        {allTags.map(tag => (
                            <label key={tag} className={styles.tagRow} onClick={() => toggleTag(tag)}>
                                <span className={`${styles.checkbox} ${filters.tags.includes(tag) ? styles.checkboxChecked : ''}`}>
                                    {filters.tags.includes(tag) && (
                                        <svg viewBox="0 0 10 10" className={styles.checkIcon} fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <polyline points="1.5,5 4,7.5 8.5,2.5" />
                                        </svg>
                                    )}
                                </span>
                                <span className={styles.tagLabel}>
                                    {tag}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Reset */}
            {!isDefault && (
                <button
                    onClick={() => onChange({ priceRange: [0, maxPrice || 800], inStock: 'all', tags: [] })}
                    className={styles.clearButton}
                >
                    Clear filters
                </button>
            )}
        </div>
    )
}
