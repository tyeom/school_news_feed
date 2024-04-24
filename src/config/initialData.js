import Role from '~/models/roleModel';
import User from '~/models/userModel';
import logger from './logger';

async function initialData() {
	try {
        // 역할 정보 데이터
		const countRoles = await Role.estimatedDocumentCount();
        // 데이터가 없는 경우 초기 데이터 생성
		if (countRoles === 0) {
			await Role.create(
				{
					name: 'Administrator',
                    description: "관리자"
				},
				{
					name: 'Student',
					description: "학생"
				}
			);
		}

        // 유저 데이터
		const countUsers = await User.estimatedDocumentCount();
        // 기본 관리자, 학생 계정 생성
		if (countUsers === 0) {
			const roleAdministrator = await Role.findOne({ name: 'Administrator' });
            const roleStudent = await Role.findOne({ name: 'Student' });

			await User.create(
				{
					firstName: '엄',
					lastName: '태영',
					userName: 'admin',
					email: 'admin@gmail.com',
					password: '123',
					roles: [roleAdministrator, roleStudent]
				},
				{
					firstName: '강',
					lastName: '나언',
					userName: 'admin2',
					email: 'admin@example.com',
					password: '123',
					roles: [roleAdministrator, roleStudent]
				},
				{
					firstName: '아',
					lastName: '이유',
					userName: 'student1',
					email: 'student1@example.com',
					password: '123',
					roles: [roleStudent]
				},
				{
					firstName: '유',
					lastName: '인나',
					userName: 'student2',
					email: 'student2@example.com',
					password: 'user',
					roles: [roleStudent]
				}
			);
		}
	} catch (err) {
		logger.error(err);
	}
}

export default initialData;
