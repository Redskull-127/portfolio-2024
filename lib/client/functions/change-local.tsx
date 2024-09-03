import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { setUserLocale } from '@/lib/internationalization/locale';
import { toast } from 'sonner';

export type AllLocales = 'en' | 'es' | 'fr' | 'hi' | 'ja' | 'ur' | 'zh';

export default function ChangeLocal() {
  const locale = useLocale();

  const selectItemList = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ur', label: 'Urdu' },
    { value: 'zh', label: 'Chinese' },
  ];

  return (
    <Select
      onValueChange={(e) => {
        toast.promise(setUserLocale(e as AllLocales), {
          loading: 'Changing language...',
          success: 'Language changed successfully',
          error: 'Failed to change language :(',
        });
        e = '';
      }}
    >
      <SelectTrigger
        showIcon={false}
        className="w-fit font-bold h-10 bg-primary text-primary-foreground"
      >
        <h1>{locale.toUpperCase()}</h1>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {selectItemList.map((item, index) => (
            <SelectItem
              // disabled={item.value.toLowerCase() === locale.toLowerCase()}
              className={cn('font-medium cursor-pointer')}
              key={index}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
