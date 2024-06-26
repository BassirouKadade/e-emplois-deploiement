import React, {useEffect } from 'react';
import { Table, Tag } from 'antd';
import Skeleton from 'react-loading-skeleton';
import ProgressBar from "@ramonak/react-progress-bar";
import getProgressColor from '../../services/getProgressColor';
const ModulesVerification = ({data}) => {
 const {getModuleFiliereGroupe,isLoadingModuleFiliereGroupes}=data

//  console.log(getModuleFiliereGroupe)
  const columns = [
    {
      title: 'Code',
      dataIndex: 'codeModule',
      key: 'codeModule',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'capacite',
    },
    {
      title: 'MH',
      dataIndex: 'masseHoraire',
      key: 'masseHoraire',
    },
    {
      title: 'DR',
      dataIndex: 'GroupeModule',
      key: 'GroupeModule',
      render: (GroupeModule) => {
       const data = GroupeModule?.dr;
        return (
          <Tag color={data > 5 ? 'geekblue' : 'green'} key={data}>
            {data} heures
          </Tag>
        );
      }
    },    
    {
      title: "Etat d'avancement",
      key: 'GroupeModule',
      dataIndex: 'GroupeModule',
      render: (GroupeModule) => {
        const data = parseInt(GroupeModule?.etat_avancement);
        return <ProgressBar bgColor={getProgressColor(data)} strokeWidth={4} completed={data} />;
      },
    }
    
  ];
  return (
    isLoadingModuleFiliereGroupes|| !getModuleFiliereGroupe?   <div style={{padding:"13px", width:"600px"}}>
    {[1, 2, 3, 4,5,6].map((_, index) => (
      <Skeleton
        baseColor='#f7f7f7'
        highlightColor='#ebebeb'
        style={{ margin: "5px 0", width: "100%", height: "39px" }}
        key={index}
      />
    ))}
  </div> :<Table
      style={{width:"600px"}}
      className="custom-pagination" // Apply the custom CSS class
      columns={columns}
      dataSource={getModuleFiliereGroupe}
      pagination={{
        position: ['bottomLeft'],
        pageSize: 5, // Limit to 3 elements per page
      }}
    />
  );
};

export default ModulesVerification;

