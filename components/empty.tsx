import Image from "next/image";

interface EmptyProps {
    label: string;
}

export const Empty = ({
    label
}: EmptyProps) => {
    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative h-16 w-16">
                <Image 
                alt="Empty"
                fill
                src="/DreamBrook_logo.png"
                />
            </div>
            <p className="text-muted-foreground text-sm  text-center">
                {label}
            </p>
        </div>
    );
}