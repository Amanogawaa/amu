import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CircleAlertIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useId, useState } from 'react'
import { Button } from '../ui/button'

const PROJECT_NAME = 'Origin UI'

const DeleteCourse = () => {
  const id = useId()
  const [inputValue, setInputValue] = useState('')

  return (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <CircleAlertIcon className="opacity-80" size={16} />
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            Final confirmation
          </DialogTitle>
          <DialogDescription className="sm:text-center">
            This action cannot be undone. To confirm, please enter the project
            name <span className="text-foreground">Origin UI</span>.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form className="space-y-5">
        <div className="*:not-first:mt-2">
          <Label htmlFor={id}>Project name</Label>
          <Input
            id={id}
            type="text"
            placeholder="Type Origin UI to confirm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="flex-1"
            disabled={inputValue !== PROJECT_NAME}
          >
            Delete
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export default DeleteCourse
