import CircularProgress from '@mui/material/CircularProgress';

export default function Progress({h,w, color}) {
  return ( <CircularProgress style={{width:w,height:h, color:color}} />  );
}
