import slugify from "slugify";

export function generateSlug(name) {
    return slugify(name,{
        lower:true,
        strict:true,
        trim:true,
    });
}