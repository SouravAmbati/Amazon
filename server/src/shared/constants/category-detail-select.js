export const CATEGORY_DETAIL_SELECT = {
    id: true,
    name: true,
    slug: true,
    image: true,

    parent: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },

    children: {
        select: {
            id: true,
            name: true,
            slug: true,
            image: true,
        },
        orderBy: {
            name: "asc",
        },
    },
};