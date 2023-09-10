import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Switch,
  Select,
  SelectItem,
  Checkbox,
  CheckboxGroup,
  Selection as NextSelection,
} from "@nextui-org/react";
import { rows } from "./data";
import AutoSizer from "react-virtualized-auto-sizer";
import { SunIcon, MoonIcon, LockIcon } from "lucide-react";
import { atom, useAtom } from "jotai";

import { atomWithStorage } from "jotai/utils";
import { AcmeLogo } from "./AcmeLogo";

const columns = [
  {
    key: "company",
    label: "Mandant",
  },
  {
    key: "kst",
    label: "KST",
  },
  {
    key: "department",
    label: "Abteilung",
  },
  {
    key: "group",
    label: "Gruppe",
  },
  {
    key: "locked",
    label: "Gesperrt",
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ["Kostenstellen", "Weitere Infos"];
  const [status] = useAtom(statusAtom);
  const [com, setCom] = useState<NextSelection>(new Set([]));
  const [dep, setDep] = useState<NextSelection>(new Set([]));
  const arrCom = Array.from(com);
  const arrDep = Array.from(dep);

  const filteredRows = rows.filter((e) => {
    const lockedStr = e.locked ? "locked" : "active";
    const filterLocked = status.includes(lockedStr);
    const filterCom = arrCom.length === 0 ? true : arrCom.includes(e.company);
    const filterDep =
      arrDep.length === 0 ? true : arrDep.includes(e.department);
    return filterLocked && filterCom && filterDep;
  });

  return (
    <div className="flex flex-col max-h-full h-full px-4 gap-2">
      <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link href="#">Kostenstellen</Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Weitere Infos
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <ThemeSwitcher />
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 0 ? "primary" : "foreground"}
                className="w-full"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div className="flex gap-2 flex-wrap">
        <Select
          label="Mandant"
          placeholder="Mandant wählen"
          className="max-w-xs"
          selectedKeys={com}
          onSelectionChange={setCom}
          selectionMode="multiple"
        >
          {[...new Set(rows.map((e) => e.company))].map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Abteilung"
          placeholder="Abteilung wählen"
          className="max-w-xs"
          selectedKeys={dep}
          onSelectionChange={setDep}
          selectionMode="multiple"
        >
          {[...new Set(rows.map((e) => e.department))].map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </Select>
        <StatusCheckboxes />
      </div>
      <div className="flex-1">
        <AutoSizer>
          {(size) => {
            return (
              <div
                style={{
                  width: size.width,
                  height: size.height,
                  overflow: "scroll",
                }}
              >
                <Table isHeaderSticky removeWrapper>
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={filteredRows}
                    emptyContent={"Keine Ergebnisse gefunden"}
                  >
                    {(item) => (
                      <TableRow
                        key={item.kst + item.department}
                        className="hover:bg-divider rounded-md"
                      >
                        <TableCell>{item.company}</TableCell>
                        <TableCell className="font-semibold text-secondary">
                          {item.kst}
                        </TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.group}</TableCell>
                        <TableCell>
                          {item.locked && (
                            <LockIcon size={16} className="text-primary" />
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
}

const statusAtom = atom<string[]>(["active", "locked"]);
function StatusCheckboxes() {
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <CheckboxGroup
      label="Status"
      orientation="horizontal"
      value={status}
      onValueChange={setStatus}
    >
      <Checkbox value="active">Aktiv</Checkbox>
      <Checkbox value="locked">Gesperrt</Checkbox>
    </CheckboxGroup>
  );
}

export const darkModeAtom = atomWithStorage("darkMode", true);
function ThemeSwitcher() {
  const [dark, setDark] = useAtom(darkModeAtom);
  useEffect(() => {
    document.body.className = `${
      dark ? "dark" : "light"
    } text-foreground bg-background h-screen w-screen`;
  }, [dark]);
  return (
    <Switch
      defaultSelected
      size="lg"
      color="primary"
      isSelected={dark}
      onValueChange={(v) => {
        setDark(v);
      }}
      startContent={<MoonIcon />}
      endContent={<SunIcon />}
    />
  );
}
