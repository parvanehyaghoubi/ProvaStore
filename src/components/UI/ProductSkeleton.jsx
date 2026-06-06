import { useAppContext } from '../../context/AppContext';

export default function ProductSkeleton({ count = 12 }) {
    const { state } = useAppContext();
    const isListView = state.viewMode === 'list';

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                isListView
                    ? <SkeletonList key={i} />
                    : <SkeletonGrid key={i} />
            ))}
        </>
    );
}

function SkeletonGrid() {
    return (
        <div className="card overflow-hidden">
            <div className="aspect-square skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-4 skeleton rounded-lg w-full" />
                <div className="h-4 skeleton rounded-lg w-2/3" />
                <div className="h-3 skeleton rounded-lg w-1/3" />
                <div className="flex justify-between items-center pt-1">
                    <div className="h-5 skeleton rounded-lg w-16" />
                    <div className="w-9 h-9 skeleton rounded-xl" />
                </div>
            </div>
        </div>
    );
}

function SkeletonList() {
    return (
        <div className="card p-4 flex gap-4">
            <div className="w-24 h-24 flex-shrink-0 rounded-xl skeleton" />
            <div className="flex-1 space-y-2">
                <div className="h-4 skeleton rounded-lg w-3/4" />
                <div className="h-3 skeleton rounded-lg w-full" />
                <div className="h-3 skeleton rounded-lg w-2/3" />
                <div className="h-8 skeleton rounded-lg w-20 mt-auto" />
            </div>
        </div>
    );
}
