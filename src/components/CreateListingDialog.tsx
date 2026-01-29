
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/services/mockApi";
import { toast } from "sonner";

interface ListingForm {
    title: string;
    category: string;
    price: string;
    credits: string;
    description: string;
}

export const CreateListingDialog = () => {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<ListingForm>();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: mockApi.createListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            toast.success("Listing created successfully!");
            setOpen(false);
            reset();
        },
        onError: () => {
            toast.error("Failed to create listing");
        }
    });

    const onSubmit = (data: ListingForm) => {
        createMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Submit New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit New Project</DialogTitle>
                    <DialogDescription>
                        List your carbon credit project on the GreenBridge marketplace.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            className="col-span-3"
                            {...register("title", { required: true })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <Input
                            id="category"
                            className="col-span-3"
                            placeholder="e.g. Reforestation"
                            {...register("category", { required: true })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (₹)
                        </Label>
                        <Input
                            id="price"
                            className="col-span-3"
                            type="number"
                            {...register("price", { required: true })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="credits" className="text-right">
                            Credits
                        </Label>
                        <Input
                            id="credits"
                            className="col-span-3"
                            type="number"
                            {...register("credits", { required: true })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Desc
                        </Label>
                        <Textarea
                            id="description"
                            className="col-span-3"
                            {...register("description")}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Submitting..." : "Submit Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
