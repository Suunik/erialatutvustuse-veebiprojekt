import React, { FunctionComponent } from 'react';
import PinkButton from '../buttons/pink_button';

type ComponentProps = {
    buttonLabel: string;
};

const LoginForm: FunctionComponent<ComponentProps> = ({
    buttonLabel
}) => {
    return (
        <form className="mt-4 space-y-4 text-black">
          <div>
            <input type="Email" className="w-full border rounded px-3 py-2 mt-2" placeholder="Email" required />
          </div>
          <div>
            <input type="password" className="w-full border rounded px-3 py-2 mt-2 mb-2" placeholder="Parool" required />
          </div>
          <div className='flex justify-center'>
            <PinkButton label={buttonLabel} />
          </div>
        </form>
      );
};

export default LoginForm;