import React from 'react';
import {
  UserOutlined,
  FileAddOutlined,
  PrinterOutlined,
  TeamOutlined,
  BankOutlined,
  BookOutlined,
  BranchesOutlined,
  GroupOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  CrownOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function CustomMenu() {
  const collapsed = useStore(state => state.collapsed);
  const onHandleOpenMenuEmploisPDF = useStore(state => state.onHandleOpenMenuEmploisPDF);
  const user =useStore.getState().user
  const roles=user.roles;

  return (
    <Sider
      width={300}
      trigger={null}
      collapsible
      collapsed={collapsed}
      className='siderNav'
      style={{
        overflowY: "scroll",
        transition: collapsed ? "none" : "all 0.3s",
        borderRight: "1px solid rgba(227, 227, 227, 0.7)",
        background: "#fff",
        color: "#000",
      }}
    >
      <div className="logo-container" style={{ color: "#000" }}>
        <span></span>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        className="custom-menu"
        style={{ border: "none", background: "#fff", transition: collapsed ? "none" : "none" }}
      >
        {/* Groupe de menu pour le tableau de bord */}
      {roles.includes('Directeur') &&<Menu.ItemGroup title={!collapsed && "Dashboard"}>
          <Menu.Item
            key="1"
            className='menuItems'
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            icon={<UserOutlined />}
          >
            <Link style={{ textDecoration: "none" }} to="/dashboard">App</Link>
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<FileAddOutlined />}
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <Link style={{ textDecoration: "none" }} to="/dashboard/creer-emploi">Créer Emplois</Link>
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={
            <span
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={onHandleOpenMenuEmploisPDF}
            >
              <PrinterOutlined />     
           </span>
            }
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <span
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={onHandleOpenMenuEmploisPDF}
              style={{ marginLeft: "-10px", paddingTop: "10px", padding: "10px" }}
            >
              Imprimer Emplois
            </span>
          </Menu.Item>
        </Menu.ItemGroup>} 
        {/* Groupe de menu pour la gestion du centre */}
        {roles.includes('Directeur') &&  <Menu.ItemGroup title={!collapsed && "Gestion du centre"}>
          <Menu.Item
            key="4"
            icon={<TeamOutlined />}
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <Link style={{ textDecoration: "none" }} to="formateur/liste-formateur">Formateurs</Link>
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<BankOutlined />}
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <Link style={{ textDecoration: "none" }} to="salle/liste-salle">Salles</Link>
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<BookOutlined />}
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <Link style={{ textDecoration: "none" }} to="module/liste-module">Module</Link>
          </Menu.Item>
          <Menu.Item
            key="7"
            icon={<BranchesOutlined />}
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <Link style={{ textDecoration: "none" }} to="filiere/liste-filiere">Filière</Link>
          </Menu.Item>
          <Menu.Item
            key="8"
            icon={<GroupOutlined />}
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <Link style={{ textDecoration: "none" }} to="groupe/liste-groupe">Groupe</Link>
          </Menu.Item>
          {/* <Menu.Item
            key="9"
            icon={<UsergroupAddOutlined />}
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            className='menuItems'
          >
            <Link style={{ textDecoration: "none" }} to="/students">Étudiants</Link>
          </Menu.Item> */}
          </Menu.ItemGroup>}

          {roles.includes('Administrateur') && <Menu.ItemGroup title={!collapsed && "Administration"}>
          {roles.includes('Administrateur') && !roles.includes('Directeur')   && <Menu.Item
            key="1"
            className='menuItems'
            style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
            icon={<UserOutlined />}
          >
            <Link style={{ textDecoration: "none" }} to="/dashboard">App</Link>
          </Menu.Item>}
      <Menu.Item
        key="10"
        className='menuItems'
        style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
        icon={<CrownOutlined />}
      >
        <Link style={{ textDecoration: "none" }} to="directeur/directeur-liste">Directeur</Link>
      </Menu.Item>
      <Menu.Item
        key="11"
        className='menuItems'
        style={{ display: "flex", transition: "none", alignItems: "center", justifyContent: "flex-start" }}
        icon={<BankOutlined />}
      >
        <Link style={{ textDecoration: "none" }} to="etablissement/etablissement-liste">Établissement</Link>
      </Menu.Item>
    </Menu.ItemGroup>}
      </Menu>
    </Sider>
  );
}
