'use client'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  NavbarContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User
} from '@heroui/react'
import { KeySquare, LogOut, SquarePen, Store, UserCog } from 'lucide-react'

export default function AppProfile() {
  return (
    <NavbarContent as="div" justify="end">
      <Popover
        showArrow
        placement="bottom"
        // backdrop="blur"
        classNames={{
          base: 'before:bg-default-200',
          content:
            'py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black'
        }}
      >
        <PopoverTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              radius: 'sm',
              as: 'button',
              color: 'primary',
              size: 'sm',
              src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
            }}
            className="transition-transform cursor-pointer"
            description="Product Designer"
            name="Zoe Lang"
          />
        </PopoverTrigger>
        <PopoverContent className="p-1">
          <Card className="w-[300px] border-none bg-transparent" shadow="none">
            <CardHeader className="justify-between">
              <div className="flex gap-3">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                />
                <div className="flex flex-col items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    Zoey Lang
                  </h4>
                  <h5 className="text-small tracking-tight text-default-500">@zoeylang</h5>
                </div>
              </div>
              <Button color="primary" radius="full" size="sm" variant="solid">
                升级Premium
              </Button>
            </CardHeader>
            <CardBody className="px-3 py-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex gap-2">
                  <p className="text-default-500 text-small w-12 text-right shrink-0">名 称</p>
                  <p className="font-semibold text-default-600 text-small truncate">幻影旅团</p>
                </div>
                <div className="flex gap-2">
                  <p className="text-default-500 text-small w-12 text-right shrink-0">联系人</p>
                  <p className="font-semibold text-default-600 text-small truncate">库洛洛</p>
                </div>
                <div className="flex gap-2 col-span-2">
                  <p className="text-default-500 text-small w-12 text-right shrink-0">邮 箱</p>
                  <p className="font-semibold text-default-600 text-small truncate">
                    12312323@qq.com
                  </p>
                </div>
                <div className="flex gap-2 col-span-2">
                  <p className="text-default-500 text-small w-12 text-right shrink-0">电 话</p>
                  <p className="font-semibold text-default-600 text-small truncate">13212341234</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="solid"
                  startContent={<SquarePen size={12} strokeWidth={3} />}
                  size="sm"
                  fullWidth
                  className="mt-4"
                >
                  编辑信息
                </Button>
                <Button
                  variant="ghost"
                  startContent={<KeySquare size={12} strokeWidth={3} />}
                  size="sm"
                  fullWidth
                  className="mt-4"
                >
                  修改密码
                </Button>
              </div>

              <Divider className="mt-3" />
            </CardBody>
            <CardFooter className="gap-3">
              <Button
                variant="shadow"
                color="danger"
                startContent={<LogOut size={12} strokeWidth={4} />}
                size="sm"
                fullWidth
              >
                退出登录
              </Button>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </NavbarContent>
  )
}
