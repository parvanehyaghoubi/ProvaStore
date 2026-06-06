import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = 'https://dummyjson.com';

// ─── Fetchers ──────────────────────────────────────────────────────────────────
async function fetchProducts({ page = 1, limit = 12, category = '', search = '' } = {}) {
    const skip = (page - 1) * limit;
    let url;

    if (search) {
        url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== 'all') {
        url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
    } else {
        url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

async function fetchProductById(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

async function fetchCategories() {
    const res = await fetch(`${BASE_URL}/products/category-list`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

// ─── Mock mutation: submit review ─────────────────────────────────────────────
async function submitReview({ productId, review }) {
    const res = await fetch(`${BASE_URL}/comments/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: review.comment, postId: productId, userId: 1 }),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

export function useProducts({ page = 1, limit = 12, category = 'all', search = '' } = {}) {
    return useQuery({
        queryKey: ['products', { page, limit, category, search }],
        queryFn: () => fetchProducts({ page, limit, category, search }),
        staleTime: 5 * 60 * 1000, 
        placeholderData: (prev) => prev, 
    });
}

export function useProduct(id) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 30 * 60 * 1000, 
    });
}

export function useSubmitReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitReview,
        onSuccess: (_, variables) => {
            // Invalidate the specific product so it refetches
            queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
        },
    });
}
